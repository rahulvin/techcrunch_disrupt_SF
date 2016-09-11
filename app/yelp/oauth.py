from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator

auth = Oauth1Authenticator(
    consumer_key="-NMu3SJt1OIiZC097Ym3zw",
    consumer_secret="M1-nHDRaZf_oh7wqpsnNs3etQfc",
    token="bwn8Au16qJ8VeLzLjT2XFKlRMpZMZib1",
    token_secret="nsP3FAYeCSllTDmHbp7oQuBItPU"
)

client = Client(auth)

# Search Query
def query():
	params = {
	'term':'food',
	'lang':'en'
	}
	results = client.search('San Francisco',params)
	return results

if __name__ == '__main__':
	print query()