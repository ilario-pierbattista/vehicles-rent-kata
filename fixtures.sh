#!/usr/bin/env bash

docker-compose exec -T mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < fixtures.sql