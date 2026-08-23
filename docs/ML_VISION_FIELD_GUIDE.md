# ML / Computer Vision Field Guide

## Basic ML questions you should retrieve quickly

- Train learns parameters; validation tunes choices; test estimates final generalization.
- High bias = underfit. High variance = train good / validation poor.
- Precision asks “when I predict positive, how often am I right?” Recall asks “of true positives, how many did I find?”
- Accuracy can be useless under class imbalance.
- Data leakage makes evaluation unrealistically good.
- Threshold selection is a product/risk decision, not only a model decision.

## Embeddings and cosine

An embedding maps an item to a dense vector. Cosine similarity compares vector direction:

`cos(a,b) = (a·b) / (||a|| ||b||)`

If vectors are L2-normalized, inner product equals cosine. This is why a normalized ArcFace + FAISS `IndexFlatIP` design can rank by cosine-style similarity.

## YOLO mental model

A YOLO-style one-stage detector predicts object classes and bounding boxes from multi-scale visual features. For interview debugging, separate:

1. data/labels,
2. preprocessing/letterbox,
3. detector confidence,
4. IoU/NMS,
5. class imbalance,
6. domain shift,
7. postprocessing/coordinate mapping.

IoU measures box overlap. NMS removes duplicate predictions. Raising confidence often improves precision while reducing recall; NMS threshold controls how aggressively overlapping boxes are removed.

## Tracking

SORT: Kalman filter predicts track state; IoU cost + Hungarian assignment matches detections to tracks. DeepSORT adds appearance features to improve identity stability under occlusion/crowding.

## ANPR as a system, not one model

Capture → plate detection → ROI → tracking → crop recognition → temporal voting → dedup/rate limit → persist/publish. Measure each stage independently. OCR can be the bottleneck even if detector FPS looks excellent.

## Face recognition

Detect → align landmarks → ArcFace embedding → normalized similarity search → threshold. Detection/alignment errors propagate into embedding quality. At larger scale, use FAISS/ANN rather than scanning an on-disk Python list.

## MMC, motion and VLM

Vehicle make/model/color is usually a detection/classification pipeline over vehicle crops. Motion can use inexpensive background/frame differences for static cameras or learned temporal methods for harder scenes. VLM means a vision-language model; **vLLM** is an LLM serving engine—do not conflate them.
