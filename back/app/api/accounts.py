from . import bp
from flask import request, jsonify
from app.models.models import db, Account


@bp.route('/accounts', methods=['GET','POST'])
def add_account():
    
    if request.method == 'GET':
        """Fetch all accounts from the database."""
        accounts = Account.query.all()
        
        # Convert query results into JSON format
        account_list = [{
            'account_id': account.account_id,
            'account_name': account.account_name,
            'account_type': account.account_type
        } for account in accounts]

        return jsonify(account_list), 200

    if request.method == 'POST':
        data = request.get_json()
        account_name = data.get('account_name')
        account_type = data.get('account_type')
        
        if not account_name or not account_type:
            return jsonify({'error': 'Missing account_name or account_type'}), 400

        new_account = Account(account_name=account_name, account_type=account_type)
        db.session.add(new_account)
        db.session.commit()
        return jsonify({
            'account_id': new_account.account_id,
            'account_name': new_account.account_name,
            'account_type': new_account.account_type
        }), 201