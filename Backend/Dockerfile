FROM ubuntu:20.04


RUN useradd -ms /bin/bash sandbox

WORKDIR /home/sandbox

# update and upgrade the system
RUN apt update && apt upgrade -y

RUN apt install nano curl -y

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs

RUN echo "PS1='\w '" >> /home/sandbox/.bashrc

WORKDIR /home/sandbox/app
        