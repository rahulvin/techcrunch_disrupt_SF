import rauth

params = dict()
params['term'] = "Cream Puffs"
params['location'] = "San Francisco"

def get_results(params):
   
  session = rauth.OAuth1Session(
    consumer_key="-NMu3SJt1OIiZC097Ym3zw",
    consumer_secret="M1-nHDRaZf_oh7wqpsnNs3etQfc",
    access_token="bwn8Au16qJ8VeLzLjT2XFKlRMpZMZib1",
    access_token_secret="nsP3FAYeCSllTDmHbp7oQuBItPU")
     
  request = session.get("http://api.yelp.com/v2/search",params=params)
  return request.json()