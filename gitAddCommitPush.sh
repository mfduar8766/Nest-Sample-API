#! /bin/bash

function addcommitpush () {

echo "Adding and commiting files"

current=$(git branch | grep "*" | cut -b 3-)

message=\'"$@"\'
git add --all :/ && git commit -a -m "$message"

# feature/debug/refactor options for 1st part of branch name
echo "What type of branch it is: 
f - feature
d - debug
r - refactor"

read feature
case $feature in
    f) #feature
    feature="feature"
    ;;
    d) #debug
    feature="debug"
     ;;
    r) #refactor
    feature="refactor"
    ;;
    *) #Invalid option
    echo "Invalid Option"
    ;;    
esac

echo "Where to push?"
read -i "$feature/$current" -e branch

echo "You sure you wanna push? (y/n)"
read -i "y" -e yn

if [ "$yn" = y ]; then
  git push origin "$branch"
else
  echo "Have a nice day!"
fi
}
addcommitpush $1
