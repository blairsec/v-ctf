#!/bin/sh
for theme in themes/*
do
    filename="${theme#themes/}"
    ./build-one.sh "$filename"
done
