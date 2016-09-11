from app import app
from flask import render_template
from yelp.testyelp import get_result

@app.route('/')
def index():
    return render_template('initial_form.html')

@app.route('/map')
def map():
	results = get_result()
	return render_template('map.html',results=results)