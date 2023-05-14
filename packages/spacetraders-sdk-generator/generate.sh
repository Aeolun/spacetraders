node_modules/.bin/openapi-generator-cli generate \
 -i ../../../api-docs/reference/SpaceTraders.json \
 -o ../spacetraders-sdk \
 -g typescript-axios \
 --additional-properties=npmName="spacetraders-sdk" \
 --additional-properties=npmVersion="2.0.0" \
 --additional-properties=supportsES6=true \
 --additional-properties=withSeparateModelsAndApi=true \
 --additional-properties=modelPackage="models" \
 --additional-properties=apiPackage="api"

