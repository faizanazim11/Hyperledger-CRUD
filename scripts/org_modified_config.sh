#!/bin/bash

jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"ma":.[1]}}}}}' config.json ./channels/ma.json > modified_config.json
