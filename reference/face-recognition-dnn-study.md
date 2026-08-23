# Sanitized Face Recognition Reference

Flask service → DSFD face detection with ResNet-152 backbone → MTCNN alignment → ArcFace embedding → cosine similarity against enrolled embeddings.

Study path: detection quality → alignment → embedding normalization → threshold calibration → exact vector search → FAISS/ANN scaling, model/index versioning and privacy/security.
