build-image:
	docker buildx build --platform linux/amd64 -t jnet-ui:latest .

run-image: stop-image
	docker run -d -p 80:80 --rm --name jnet-ui --network shared jnet-ui:latest

stop-image:
	docker rm -f jnet-ui

logs:
	docker logs -f jnet-ui
