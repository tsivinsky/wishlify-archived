#! /bin/bash

mode="$1"

__dev() {
	docker-compose up --build -d db
}

__prod() {
	docker-compose up --build
}

if [[ "$mode" == "dev" ]]; then
	__dev
elif [[ "$mode" == "prod" ]]; then
	__prod
fi
