from app import app
from flask import render_template


@app.route('/')
def index():
    return render_template('map.html')

@app.route('/map')
def map():
	return render_template('map.html')