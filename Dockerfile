# Define custom function directory
ARG FUNCTION_DIR="/function"

#FROM cypress/base:14.7.0 as build-image
FROM cypress/browsers:node12.18.3-chrome87-ff82 AS build-image

ENV CI=1
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Install aws-lambda-cpp build dependencies
RUN apt update && \
    apt install -y \
    ffmpeg \
    xvfb \
    g++ \
    make \
    cmake \
    unzip \
    xserver-xorg-input-mouse \
    xserver-xorg-input-kbd \
    libcurl4-openssl-dev

# Copy function code
COPY app/ ${FUNCTION_DIR}/
ADD aws-lambda-rie /usr/local/bin/aws-lambda-rie

WORKDIR ${FUNCTION_DIR}

# Define environment variables for cypress
ENV CYPRESS_CACHE_FOLDER="/function/.cache"
ENV DISPLAY=:99

RUN npm install aws-lambda-ric

RUN npm install

USER root
COPY cypress-for-lambda.sh .
RUN bash cypress-for-lambda.sh

# ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
ENTRYPOINT [ "./entry_script.sh" ]
CMD ["app.handler"]
