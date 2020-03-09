NAME = computorv2

all: $(NAME)

$(NAME):
	npm i
	echo '#!/bin/sh' > ./computorv2
	echo 'node ./computorv2.js "$$@"' >> ./computorv2
	chmod +x ./computorv2

clean:
	rm -rf node_modules

fclean: clean
	rm -f computor

re: fclean all

.PHONY: all clean fclean re