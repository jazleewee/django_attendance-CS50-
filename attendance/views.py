from django.shortcuts import render
from lockdown.decorators import lockdown
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
from django.template.defaulttags import register

SubUnit1_values = [
    "FINANCE",
    "HR",
    "OPS",
    "R&D",
    "IT",
    "SERVICES"
]

status_values = [
    "Present",
    "Absent (MC)",
    "Absent (SPECIAL)",
    "On Leave"
]

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def SubUnit1_filter(dictionary, SubUnit):
    keyValList = [SubUnit]
    try:
        return list(filter(lambda row: row['Sub-Unit 1'] in keyValList, dictionary))
    except:
        return []

@register.filter
def SubUnit2_filter(dictionary, SubUnit):
    keyValList = [SubUnit]
    try:
        return list(filter(lambda row: row['Sub-Unit 2'] in keyValList, dictionary))
    except:
        return []

@register.filter
def status_filter(dictionary, status):
    keyValList = [status]
    try:
        return list(filter(lambda row: row['Status'] in keyValList, dictionary))
    except:
        return []

@register.filter
def get_count(dictionaries):
    count = 0
    if len(dictionaries) == 1:
        try:
            count = dictionaries[0].get("Count")
        except:
            pass
    else:
        for dictionary in dictionaries:
            try: 
                count += dictionary.get("Count")
            except:
                pass
    return count
    
@register.filter
def attendance_filter(dictionary, SubUnit1):
    keyValList = SubUnit1
    try:
        return list(filter(lambda row: row['Sub-Unit 1'] in keyValList, dictionary))
    except:
        return []

@register.filter
def get_SubUnit2(data, SubUnit1):

    try:
        keyValList = [SubUnit1]
        temp = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
        SubUnit2 = sorted(set([row["Sub-Unit 2"] for row in temp]), key=sorter, reverse=False)
        return SubUnit2
    except:
        return []

@register.filter
def get_all_absent(dictionary):
    try:
        keyValList = ["Absent (SPECIAL)", "Absent (MC)"]
        return pd.DataFrame(list(filter(lambda row: row['Status'] in keyValList, dictionary)))["Count"].sum()
    except:
        return 0

# Create your views here.

@lockdown()
def index(request):

    data, attendance, update = get_attendance()

    data, SubUnit1 = select_company("all", data)
    return render(request, 'attendance/index.html', {
        "update": update,
        "SubUnit1_values": SubUnit1_values,
        "attendance": attendance,
        "data": data,
    })

def logout(request):
    return render(request, 'attendance/index.html')

@lockdown()
def company(request, company):

    data, attendance, update = get_attendance()

    if company == "finance":
        data, SubUnit1 = select_company("finance", data)
    elif company == "hr":
        data, SubUnit1 = select_company("hr", data)
    elif company == "ops":
        data, SubUnit1 = select_company("ops", data)
    elif company == "research":
        data, SubUnit1 = select_company("research", data)
    elif company == "it":
        data, SubUnit1 = select_company("it", data)
    elif company == "services":
        data, SubUnit1 = select_company("services", data)
    elif company == "all":
        data, SubUnit1 = select_company("all", data)
    else:
        data, SubUnit1 = select_company("all", data)

    return render(request, 'attendance/company.html', {
        "company": company,
        "data": data,
        "SubUnit1_values": SubUnit1_values,
        "SubUnit1": SubUnit1,
        "update": update,
        "attendance": attendance,
        "status_values": status_values
    })

@lockdown()
def search(request):
    data, attendance, update = get_attendance()
    data, SubUnit1 = select_company("all", data)
    
    return render(request, 'attendance/search.html', {
        "data": data
    })

def select_company(company, data):

    if company == "finance":
        keyValList = ["FINANCE"]
        data = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
    elif company == "hr":
        keyValList = ["HR"]
        data = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
    elif company == "ops":
        keyValList = ["OPS"]
        data = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
    elif company == "research":
        keyValList = ["R&D"]
        data = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
    elif company == "it":
        keyValList = ["IT"]
        data = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
    elif company == "services":
        keyValList = ["SERVICES"]
        data = list(filter(lambda row: row['Sub-Unit 1'] in keyValList, data))
    elif company == "all":
        data = data

    # Get unique list of Sub-Unit 1
    SubUnit1 = sorted(set([row["Sub-Unit 1"] for row in data]), key=sorter, reverse=False)

    return data, SubUnit1

def sorter(SubUnit):
    order = [
        'FINANCE', 'HR', 'OPS', 'R&D', 'IT', 'SERVICES',
        'CFO OFFICE', 'TALENT ACQUISITION', 'LEARNING & DEVELOPMENT', 'COO OFFICE',
        'GLOBAL OPS', 'REGIONAL OPS', 'CRO OFFICE', 'BIOTECHNOLOGY', 'FOOD SCIENCES',
        'CTO OFFICE', 'HARDWARE', 'SOFTWARE', 'GLOBAL OFFICE', 'COMPLIANCE', 'LEGAL'    
    ]

    return order.index(SubUnit)


def LastUpdated():

    scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"]

    creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
    client = gspread.authorize(creds)
    update =  client.open("Attendance").get_worksheet(1).cell(1, 2).value

    return update

def get_attendance():

    scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"]

    creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
    client = gspread.authorize(creds)
    data = client.open("Attendance (CS50)").get_worksheet(0).get_all_records()

    by_columns = ["Sub-Unit 1", "Sub-Unit 2", "Status"]
    attendance = pd.DataFrame(data)[by_columns + ["Position"]].groupby(by=by_columns).count().reset_index().rename(columns={"Position": "Count"}).to_dict(orient="records")
    update =  client.open("Attendance (CS50)").get_worksheet(1).cell(1, 2).value

    return data, attendance, update