MMSAR / HOMESENSE
=================
Folder:  projects/mmsar  (compose project name "homesense")
Type:    Multimodal smart-home activity-recognition platform: ML research
         code plus a full web product around it
Stack:   Python ML core (har_core: sequence, image, graph and text
         modalities fused into one classifier), FastAPI service, background
         worker, streaming services (windows, predictor, anomaly, shadow
         model, sink), MLflow, MinIO, PostgreSQL, React + TypeScript web app,
         Expo mobile app, a dev OpenID Connect provider
Runs on: web http://localhost:3005, API http://localhost:4004, inference
         4005 and shadow inference 4006, MLflow 5011, idp 5012, MinIO 5013
         (about fifteen containers)

WHAT IT IS
----------
A model that recognises human activity from smart-home sensor events on the
CASAS datasets (Aruba, Milan, Cairo, Kyoto, Orange). Each window of sensor
events is turned into four views (a sequence, a behaviour image, a sensor
graph and a text description) and fused. Around it sits a product: houses
with floor plans and published sensor metadata, validated datasets, model
registry with lifecycle checks and shadow runs, batch prediction jobs, a
predictions explorer, anomaly detection, a live simulator, and role-based
access through OpenID Connect.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png         Landing/sign-in entry ("Activity intelligence
                    workspace").
02-sign-in-provider.png
                    The sign-in page, which starts an OpenID Connect
                    authorisation-code flow (PKCE).
03-idp-login.png    The dev identity provider: choose a predefined user
                    (admin, researcher, viewer) or a custom one and
                    authorise. Roles decide what the app lets you do.
04-dashboard.png    Operations overview: houses, datasets, models and
                    prediction-job counts, and recent prediction jobs.
05-houses.png       Houses: five published configurations with floor-plan
                    size and version.
14-house-detail.png One house: live view, floor-plan annotation, published
                    configuration versions (checksum, sensors) and validity.
06-datasets.png     Validated sensor-event collections pinned to published
                    house metadata.
07-models.png       Registered model artifacts matched to house versions.
08-lifecycle.png    Model lifecycle: checks, shadow run and promotion.
09-prediction-jobs.png
                    Batch inference with compatible dataset and model pairs.
10-predictions.png / 13-predictions-timeline.png
                    Predictions explorer: the activity timeline coloured by
                    predicted activity (opacity follows confidence), class
                    distribution, the average per-modality signal (text,
                    sequence, image, graph) and a window list with evidence.
11-anomalies.png    Unusual patterns raised by the detectors.
12-simulator.png    Scenarios replayed through the same pipeline as real
                    sensors.

NOTE ON PORTS (for whoever runs this through mydocker)
------------------------------------------------------
The web build expects the identity provider on localhost:9400 and the API on
localhost:8000, and the API only allows the browser origin
http://localhost:5173. The mydocker dashboard publishes them on 5012 and 4004
and the site on 3005, so signing in through a plain browser fails until
those values are rebuilt or configured to match (build-time API/OIDC base
URLs and CORS_ORIGINS=http://localhost:3005). To take these screenshots the
browser's requests to 9400 and 8000 were redirected to 5012 and 4004 and the
CORS headers added at the browser; the application itself was not changed.
The signed-in pages above show data that already existed in the local
database (five houses, eleven prediction jobs).

HOW TO RUN
----------
From the mydocker dashboard: type "mmsar" then "up" (the first start builds
many images and takes several minutes), then "open".
