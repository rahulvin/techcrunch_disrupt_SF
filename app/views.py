from app.yelp import testyelp, params

from app import app
from flask import render_template, request


@app.route('/')
def index():
    return render_template('initial_form.html')


@app.route('/map')
def map():
    results = testyelp.get_results(params)
    location = request.args.get('city_of_travel')
    return render_template('map.html', results=results, city_of_travel=location)
