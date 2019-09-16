#!/bin/bash
set -e
if [ $NODE_ENV != 'development' ]
then
  exit 1
fi

