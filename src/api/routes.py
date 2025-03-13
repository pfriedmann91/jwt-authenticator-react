"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from api.utils import APIException

print("Cargando routes.py...")
api = Blueprint('api', __name__)
print("Blueprint 'api' creado con éxito")


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    print("Ruta /hello accedida")
    return jsonify(response_body), 200
print("Ruta /hello registrada")

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("Datos recibidos:", data)
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Faltan email o contraseña'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'El usuario ya existe'}), 400
    
    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuario creado exitosamente'}), 201
print("Ruta /signup registrada")

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Datos recibidos:", data)
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:
        return jsonify({'message': 'Credenciales inválidas'}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify({'access_token': access_token})
print("Ruta /login registrada")

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({'message': 'Token inválido'}), 401
    return jsonify({'message': f'Bienvenido a la página privada, {current_user}'})
print("Ruta /private registrada")