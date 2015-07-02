FROM    centos:centos6

RUN     yum -y update; yum clean all
RUN     curl -sL https://rpm.nodesource.com/setup | bash -
RUN     yum install -y gcc-c++ make nodejs git; yum clean all
RUN     npm install -g grunt-cli

# Start openFDA Viz

COPY    . /src
RUN     echo {} > /src/aws.json
RUN     cd /src; npm install --unsafe-perm

EXPOSE  8000
EXPOSE  3001

RUN     cd /src; npm run-script startDev


# docker build -t stlviper/openfdaviz .