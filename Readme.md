# General

This is just a little playabout with Express to test the handling of potential filters of the kviewer server.

Some basic date filtering is added like so:

``curl localhost:3005/pods/?date=2024-04-06``

# Docker

``docker build . -t robertireton/filtersvr:latest``

``docker run --net=host -d --name filtersvr -p 8888:8888 robertireton/filtersvr``

``docker push robertireton/filtersvr``