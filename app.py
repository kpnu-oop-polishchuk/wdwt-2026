from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/api/donate', methods=['POST'])
def donate():
    payload = request.get_json(silent=True) or {}

    name = payload.get('name', '').strip()
    email = payload.get('email', '').strip()
    amount = payload.get('amount')
    currency = payload.get('currency', 'UAH')
    comment = payload.get('comment', '').strip()

    try:
        if not name:
            raise ValueError('Поле «Ім’я» не може бути порожнім.')
        if not email:
            raise ValueError('Поле «Email» не може бути порожнім.')
        if '@' not in email or '.' not in email:
            raise ValueError('Будь ласка, введіть коректний email.')
        if amount is None or int(amount) <= 0:
            raise ValueError('Сума внеску має бути позитивним числом.')

        response = {
            'ok': True,
            'message': f"Дякуємо, {name}! Ми отримали ваш внесок у розмірі {int(amount)} {currency}.",
            'data': {
                'name': name,
                'email': email,
                'amount': int(amount),
                'currency': currency,
                'comment': comment
            }
        }
        return jsonify(response), 200
    except Exception as error:
        return jsonify({
            'ok': False,
            'message': str(error)
        }), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
