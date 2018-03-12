from flask import Flask, jsonify, abort, make_response, request, url_for
import os, json

app = Flask(__name__)

#############################
# For development only
from flask_cors import CORS
CORS(app)
DATA = {}
NOTE_FILE_PATH = "data/notes.json"
#############################

def file_exists(file_path):
    if os.path.isfile(path):
        return True

@app.route('/api/v1.0/notes/<string:user_id>', methods=['GET'])
def get_notes(user_id):
    global DATA
    if not DATA:
        if not os.path.isfile(NOTE_FILE_PATH):
            with open(NOTE_FILE_PATH, "w") as f:
                f.write("{}")
        with open(NOTE_FILE_PATH, "r") as f:
            DATA = json.loads(f.read())
    if user_id not in DATA.keys():
        DATA[user_id] = [{"title":"{} has no notes".format(user_id), "content":"Create your own note!"}]
    return jsonify(DATA[user_id])

@app.route('/api/v1.0/notes/<string:user_id>', methods=['POST'])
def put_note(user_id):
    global DATA
    if not request.json or not 'title' in request.json:
        abort(400)
    DATA[user_id].append(request.json)
    with open(NOTE_FILE_PATH, "w") as f:
        f.write(json.dumps(DATA))
    return jsonify(DATA[user_id]), 200

@app.route('/api/v1.0/notes/<string:user_id>/<int:note_index>', methods=['DELETE'])
def delete_note(user_id, note_index):
    global DATA
    del(DATA[user_id][note_index])
    return jsonify({'result': True})

if __name__ == '__main__':
    app.run(debug=True)
