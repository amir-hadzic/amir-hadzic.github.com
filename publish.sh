SITE_URL=www.randomshouting.com

if [ "$#" -eq 1 ]
then
    SITE_URL=$1
fi

cd src
jekyll --url $SITE_URL
cd _site
s3cmd put -rP * s3://${SITE_URL}
