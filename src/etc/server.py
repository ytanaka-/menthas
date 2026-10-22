import json
import os
from collections.abc import Iterable

import numpy as np
import pymongo
from bottle import abort, request, route, run
from gensim.models import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "menthas-example")
MODEL_FILE_PATH = os.getenv("MODEL_FILE_PATH", "./src/etc/model/wiki-deepwalk.model")
VECTOR_DIMENSION = 32

client = pymongo.MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]

_model = Word2Vec.load(MODEL_FILE_PATH)


def feat2vec(features: Iterable[str]) -> np.ndarray:
    vec = np.zeros(VECTOR_DIMENSION)
    for w in features:
        if w in _model.wv:
            vec += _model.wv[w]
    return vec


category_feats: dict[str, np.ndarray] = {
    category["name"]: feat2vec(category["tags"]) for category in db.categories.find({})
}


@route("/api/similarity")
def similarity() -> str:
    category = request.query.category
    features = request.query.features
    if not category or not features:
        abort(500, "invalid parameter.")
    feature_list = features.split(",")
    if category not in category_feats:
        abort(500, "category not found.")

    category_vec = category_feats[category]
    feature_vec = feat2vec(feature_list)
    score = float(cosine_similarity([category_vec], [feature_vec])[0][0])
    if score != 0.0:
        # deepwalkのmodelだと最も関連していないニュースでも下限は-0.10~15くらいになる
        # -1~1にscoreを調整するために正規化を行う
        min_similarity = -0.15
        score = 2.0 * (score - min_similarity) / (1 - min_similarity) - 1

    return json.dumps({"category": category, "similarity": score})


if __name__ == "__main__":
    run(host="localhost", port=5050)
