
USERNAME = cyz14
ADDRESS = 159.203.227.80:~/code/moq/

compress:
	tar cvzf build.tar.gz build/

decompress:
	rm -rf build/
	tar xvzf build.tar.gz

upload:
	scp build.tar.gz $(USERNAME)@$(ADDRESS)