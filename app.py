
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from urllib.parse import quote_plus  # Import the quote_plus function

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Set a secret key for session encryption
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://root:{quote_plus('Shahid@12345#')}@localhost:3306/zesty_testy_zomato"  # Update the database connection details
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking
db = SQLAlchemy(app)
CORS(app)
# migrate = Migrate(app, db)

# class Snack(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     price = db.Column(db.Float, nullable=False)
#     availability = db.Column(db.String(50), default='0')

#     def __repr__(self):
#         return f"Snack(id={self.id}, name='{self.name}', price={self.price},availability='{self.availability})"


class Snack(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    availability = db.Column(db.String(50), default='0')
    image_url = db.Column(db.String(200), nullable=False, default='https://via.placeholder.com/150')

    def __repr__(self):
        return f"Snack(id={self.id}, name='{self.name}', price={self.price}, availability='{self.availability}', image_url='{self.image_url}')"

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(255), nullable=False)
    item_id = db.Column(db.Integer, nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, customer_name, item_id, item_name, status, user_id):
        self.customer_name = customer_name
        self.item_id = item_id
        self.item_name = item_name
        self.status = status
        self.user_id = user_id

    def __repr__(self):
        return f"Order(id={self.id}, customer_name='{self.customer_name}', item_id={self.item_id}, item_name='{self.item_name}', status='{self.status}', user_id={self.user_id})"



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

    def __repr__(self):
        return f"User(id={self.id}, username='{self.username}', email='{self.email}')"


with app.app_context():
    db.create_all()

@app.route("/")
def hello():
    return "Welcome to Zagato Zomato"


@app.route('/favicon.ico')
def favicon():
    return '', 204

# Login and Register

# ✅

@app.route('/register', methods=['POST']) 
def register():
    username = request.json['username']
    password = request.json['password']
    email = request.json['email']

    # Check if the username or email already exists in the users table
    existing_user = User.query.filter(db.or_(User.username == username, User.email == email)).first()
    if existing_user:
        return jsonify(message='Username or email already exists. Please choose a different username or email.')

    # Create a new user and add it to the database
    new_user = User(username=username, password=password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message='User registered successfully.')


# ✅

@app.route('/login', methods=['POST'])
def login():
    username_or_email = request.json['username_or_email']
    password = request.json['password']

    # Check if the username or email exists in the users table
    user = User.query.filter(db.or_(User.username == username_or_email, User.email == username_or_email)).first()
    if not user:
        return jsonify(message='User does not exist. Please register.')

    # Check if the password matches the user's password in the database
    if password != user.password:
        return jsonify(message='Incorrect password.')

    return jsonify(message='success')



@app.route('/getuserId/<username>/<password>', methods=['GET'])
def getUserId(username,password):

    user = User.query.filter_by(username=username, password=password).first()
    if not user:
        return jsonify({'error': 'Invalid username or password'}), 401

    user_id = user.id

    return jsonify({'user_id': user_id}), 200




@app.route('/addsnack', methods=['POST'])
def addSnack():
    data = request.json
    item_name = data.get('name')
    item_price = data.get('price')
    item_availability = data.get('availability')
    item_image = data.get('image_url')
    snack = Snack(name=item_name, price=item_price, availability=item_availability,image_url=item_image)
    db.session.add(snack)
    db.session.commit()
    return jsonify({'id': snack.id, 'name': snack.name, 'price': snack.price, 'availability':snack.availability,'image':snack.image_url}), 201


# View all snacks
@app.route('/viewsnack', methods=['GET'])
def viewSnack():
    snacks = Snack.query.all()
    snack_data = [{'id': snack.id, 'name': snack.name, 'price': snack.price,'image':snack.image_url} for snack in snacks]
    return jsonify(snack_data), 200


# Top 5 snacks
@app.route('/viewtopsnacks', methods=['GET'])
def viewTopSnacks():
    snacks = Snack.query.order_by(Snack.price.desc()).limit(5).all()
    snack_data = [{'id': snack.id, 'name': snack.name, 'price': snack.price,'image':snack.image_url} for snack in snacks]
    return jsonify(snack_data), 200



@app.route('/updatesnack/<int:id>', methods=['PUT'])
def updateSnack(id):
    snack = Snack.query.get(id)
    if snack is None:
        return f'No snack found with ID {id}', 404

    data = request.json
    item_name = data.get('name')
    item_price = data.get('price')
    item_availability = data.get('availability')
    item_image = data.get('image_url')
    snack.name = item_name
    snack.price = item_price
    snack.availability = item_availability
    snack.image_url = item_image
    db.session.commit()
    return jsonify({'id': snack.id, 'name': snack.name, 'price': snack.price,'availability':snack.availability,'image':snack.image_url}), 200



@app.route('/deletesnack/<int:id>', methods=['DELETE'])
def deleteSnack(id):
    snack = Snack.query.get(id)
    if snack is None:
        return f'No snack found with ID {id}', 404

    db.session.delete(snack)
    db.session.commit()
    return jsonify({'message': 'Snack deleted successfully'}), 200


# Operations for orders 




# take order

@app.route('/takeorder/<int:user_id>', methods=['POST'])
def takeOrder(user_id):
    data = request.json
    customer_name = data.get('name')
    item_id = data.get('id')

    snack = Snack.query.filter_by(id=item_id).first()
    if not snack:
        return jsonify({'error': 'No snack found with this id'}), 404

    item_name = snack.name

    # Create a new Order object and add it to the database
    order = Order(customer_name=customer_name, item_id=item_id, item_name=item_name, status='order received', user_id=user_id)
    db.session.add(order)
    db.session.commit()

    return jsonify({'message': 'Order taken successfully'}), 200


# Top 5 orders
@app.route('/viewtoporders', methods=['GET'])
def viewTopOrders():
    orders = Order.query.order_by(orders.id.desc()).limit(5).all()
    orders_data = [{'customer_name': order.customer_name, 'item_name': order.item_name, 'status': order.status,"order_id":order.id} for order in orders]
    return jsonify(orders_data), 200


# View order

@app.route('/viewallorder', methods=['GET'])
def viewallOrder():
    orders = Order.query.all()
    orders_data = [{'customer_name': order.customer_name, 'item_name': order.item_name, 'status': order.status,"order_id":order.id} for order in orders]
    return jsonify(orders_data), 200


# Update order


@app.route('/updateorder/<int:order_id>', methods=['PUT'])
def updateOrder(order_id):
    data = request.json
    new_status = data.get('status')

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'No order found with this id'}), 404

    order.status = new_status
    db.session.commit()

    return jsonify({'message': 'Order updated successfully'}), 200



# View my own order

@app.route('/vieworders/<int:user_id>', methods=['GET'])
def view_orders(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    orders = Order.query.filter_by(user_id=user_id).all()
    if not orders:
        return jsonify({'message': 'No orders found for this user'}), 200

    order_list = []
    for order in orders:
        order_data = {
            'id': order.id,
            'customer_name': order.customer_name,
            'item_id': order.item_id,
            'item_name': order.item_name,
            'status': order.status
        }
        order_list.append(order_data)

    return jsonify({'orders': order_list}), 200

# Update status

@app.route('/updateOrderStatus/<int:id>', methods=['PUT'])
def updateOrderStatus(id):
    order = Order.query.get(id)
    if order is None:
        return f'No order found with ID {id}', 404

    data = request.json
    new_status = data.get('status')
    order.status = new_status
    db.session.commit()
    return jsonify({'id': order.id, 'status': order.status}), 200


# Delete my own order

@app.route('/deleteorder/<int:user_id>/<int:order_id>', methods=['DELETE'])
def deleteOrder(user_id, order_id):
    order = Order.query.filter_by(user_id=user_id, id=order_id).first()

    if not order:
        return jsonify({'error': 'No order found with this user ID and order ID'}), 404

    db.session.delete(order)
    db.session.commit()

    return jsonify({'message': 'Order deleted successfully'}), 200



if __name__ == '__main__':
    app.run(port=8080)


def create_app():
    return app    