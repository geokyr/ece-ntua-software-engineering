import subprocess
from pathlib import Path

my_path = str(Path(__file__).resolve().parent.parent)

def test_chargesby_a():
    command = my_path + '/cli/chargesby --op1 aodos --datefrom 20211005 --dateto 20211110 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_chargesby_b():
    command = my_path + '/cli/chargesby --op1 aodos --datefrom 20211110 --dateto 20211005 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'400: Bad request' in out

def test_chargesby_c():
    command = my_path + '/cli/chargesby --op1 aodos --datefrom 20201005 --dateto 20201010 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    # assert b'NumberOfPasses == 19' in out

# -----------------------------------------------------------------------------------------------------

def test_passescost_a():
    command = my_path + '/cli/passescost --op1 aodos --op2 gefyra --datefrom 20211005 --dateto 20211110 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_passescost_b():
    command = my_path + '/cli/passescost --op1 aodos --op2 gefyra --datefrom 20211110 --dateto 20211005 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'400: Bad request' in out

# -----------------------------------------------------------------------------------------------------

def test_passesanalysis_a():
    command = my_path + '/cli/passesanalysis --op1 aodos --op2 gefyra --datefrom 20211005 --dateto 20211110 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_passesanalysis_b():
    command = my_path + '/cli/passesanalysis --op1 aodos --op2 gefyra --datefrom 20211110 --dateto 20211005 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'400: Bad request' in out

# -----------------------------------------------------------------------------------------------------

def test_passesperstation_a():
    command = my_path + '/cli/passesperstation --station KO01 --datefrom 20190101 --dateto 20190110 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_passesperstation_b():
    command = my_path + '/cli/passesperstation --station KO01 --datefrom 20190110 --dateto 20190101 --format json'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'400: Bad request' in out