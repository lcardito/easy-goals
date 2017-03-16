FROM node:7.5.0

# Prepare app directory
RUN mkdir -p /usr/src/app
ADD . /usr/src/app

# Install dependencies
WORKDIR /usr/src/app
RUN chmod +x ./local.sh
RUN npm install

# Expose the app port
EXPOSE 3000

# Start the app
ENTRYPOINT ["./local.sh"]
