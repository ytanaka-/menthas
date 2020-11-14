from sklearn.metrics.pairwise import cosine_similarity
from bottle import route, request, abort, run
from gensim.models import Word2Vec as word2vec
import os
import json
import numpy as np
import pymongo
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
client = pymongo.MongoClient(MONGO_URL)
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "menthas-example")
Page = client[MONGO_DB_NAME].pages
Categories = client[MONGO_DB_NAME].categories

MODEL_FILE_PATH = os.getenv("MODEL_FILE_PATH", "./src/etc/model/wiki-deepwalk.model")
_model = word2vec.load(MODEL_FILE_PATH)
vector_dimension = 32

def feat2vec(features):
    vec = np.zeros(vector_dimension)
    for w in features:
        if w in _model.wv:
            vec += _model.wv[w]
    return vec

categories = Categories.find({})
category_feats = {}
for category in categories:
    category_feats[category["name"]] = feat2vec(category["tags"])

@route('/api/similarity')
def similarity():
    category = request.query.category
    features = request.query.features
    if not category or not features:
        abort(500, 'invalid parameter.')
    feature_list = features.split(",")
    if category not in category_feats:
        abort(500, 'category not found.')

    category_vec = category_feats[category]
    feature_vec = feat2vec(feature_list)
    similarity = cosine_similarity([category_vec], [feature_vec])[0][0]
    if similarity != 0.0:
        # deepwalkのmodelだと最も関連していないニュースでも下限は-0.10~15くらいになる
        # -1~1にscoreを調整するために正規化を行う
        min_similarity = -0.15
        similarity = 2.*(similarity - min_similarity)/(1 - min_similarity) - 1

    return json.dumps({ "category": category, "similarity": similarity })

run(host='localhost', port=5000)
