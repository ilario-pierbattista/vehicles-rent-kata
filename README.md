# Start

Run outside the container:

    docker-compose up -d
    ./fixtures.sh

Then enter into the node container with `docker-compose exec be bash` and execute the following commands:

    npm install
    npm run start:dev
