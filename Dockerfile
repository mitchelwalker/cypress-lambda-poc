# Define custom function directory
ARG FUNCTION_DIR="/function"

FROM cypress/base:14.7.0 as build-image

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Install aws-lambda-cpp build dependencies
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

# Copy function code
COPY app/ ${FUNCTION_DIR}/
ADD aws-lambda-rie /usr/local/bin/aws-lambda-rie

WORKDIR ${FUNCTION_DIR}


RUN npm install aws-lambda-ric

RUN npm install

# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}

# ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
ENTRYPOINT [ "./entry_script.sh" ]
CMD ["app.handler"]
