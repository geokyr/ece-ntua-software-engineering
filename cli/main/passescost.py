import argparse
import requests
import csv

my_parser = argparse.ArgumentParser(description='returns the amount of money op2_ID owes \
    to op1_ID in a specific period with ids and period provided in the params of the url')
my_parser.add_argument('--format', metavar='{json|csv}', type=str, 
                        help='select the format type of the output (json or csv)')
args = my_parser.parse_args()
input_format = args.format

r = requests.get('http://127.0.0.1:9103/admin/passescost')
data = r.json()

try:    
    if input_format == 'json':
        print(data)
    elif input_format == 'csv': 
        output_file = open('../csv/passescost.csv', 'w')
        output = csv.writer(output_file)
        output.writerow(data.keys())
        output.writerow(data.values())
except Exception as e:
    print(e)