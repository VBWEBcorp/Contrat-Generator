from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Server is running"})

@app.route('/api/search-company', methods=['GET'])
def search_company():
    siret = request.args.get('siret')
    if not siret:
        return jsonify({"error": "SIRET number is required"}), 400

    # Simulation de l'API Societe.com avec quelques exemples
    test_companies = {
        "91893613900016": {
            "name": "VBWEB",
            "siret": "91893613900016",
            "address": "3 allée beau rivage, 35690 Acigné",
            "email": "contact@vbweb.fr",
            "phone": "+33 (6) 61 64 12 57"
        },
        "82898905200017": {
            "name": "GOOGLE FRANCE",
            "siret": "82898905200017",
            "address": "8 rue de Londres, 75009 Paris",
            "email": "contact@google.com",
            "phone": "+33 1 42 68 53 00"
        },
        "42403915300013": {
            "name": "MICROSOFT FRANCE",
            "siret": "42403915300013",
            "address": "37 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux",
            "email": "contact@microsoft.fr",
            "phone": "+33 1 57 75 10 00"
        }
    }

    # Recherche de l'entreprise dans nos données de test
    company = test_companies.get(siret)
    if company:
        return jsonify(company)
    else:
        return jsonify({"error": "Company not found"}), 404

@app.route('/api/company-info', methods=['GET'])
def get_company_info():
    return jsonify({
        "name": "VBWEB",
        "owner": "Victor BEASSE",
        "address": "3 allée beau rivage, 35690 Acigné",
        "phone": "+33 (6) 61 64 12 57",
        "email": "contact@vbweb.fr",
        "siret": "918 936 139 00016"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
