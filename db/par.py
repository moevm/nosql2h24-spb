import requests
from bs4 import BeautifulSoup
import json
import re

base_url = 'https://citywalls.ru'

def par_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    head = soup.find('div', class_='cssHouseHead')
    data = {}
    data['name'] = head.find('h1').text
    data['main_photo'] = head.find('div', class_='photo').find('img')['src']
    info_div = head.find('div', class_='info')

    coord_img = head.find('div', class_='staticmap').find('img')['src']
    pattern = r'll=(?P<longitude>[-\d.]+),(?P<latitude>[-\d.]+)'
    match = re.search(pattern, coord_img)

    if match:
        longitude = match.group('longitude')
        latitude = match.group('latitude')
        data['coordinates'] = {'lon': longitude, 'lat': latitude}
    else:
        raise Exception('Coordinates not found')


    address_div = info_div.find('div', class_='address')
    cur_addr = ''
    addresses = []
    for i in address_div.contents:
        if i.name == 'a':
            if cur_addr:
                addresses.append(cur_addr.strip())
                cur_addr = ''
            cur_addr += i.get_text()
        elif i.name == 'br':
            continue
        else:
            cur_addr += i.strip()
    addresses.append(cur_addr.strip())
    data['addresses'] = addresses
    items_div = list(map(lambda x: x.text, info_div.find_all('td', class_='item')))
    values_div = info_div.find_all('td', class_='value')
    if 'Архитекторы:' in items_div:
        i = items_div.index('Архитекторы:')
        data['Architects'] = list(map(lambda x: x.text, values_div[i].find_all('a')))
    if 'Год постройки:' in items_div:
        i = items_div.index('Год постройки:')
        data['Architects'] = values_div[i].text.split(', ')
    if 'Стиль:' in items_div:
        i = items_div.index('Стиль:')
        data['Architects'] = values_div[i].find('a').text

    content = soup.find('div', id='m_column_wide2').contents[7].find_all(['div', 'ul'], class_=['mceContentBody', 'cssPhotoList'])

    data['main_info'] = []
    ind = 0

    for i, el in enumerate(content):
        if 'mceContentBody' in el.get('class', []) and i==0:
            text = []
            p = el.find_all('p')
            for j in range(len(p)-1, -1, -1):
                t = p[j].text
                if t == '\xa0':
                    break
                text = [t] + text
            data['main_info'].append({'type': 'text', 'index': i, 'data': text})
        elif 'mceContentBody' in el.get('class', []):
            text = list(map(lambda x: x.text, el.find_all('p')))
            text = [t for t in text if t != '\xa0']
            data['main_info'].append({'type': 'text', 'index': i, 'data': text})
        elif 'cssPhotoList' in el.get('class', []):
            imgs = list(map(lambda x: x.find('img')['src'], el.find_all('div', class_='photo')))
            data['main_info'].append({'type': 'img', 'index': i, 'data': imgs})
    return data

i = 1
count = 0
er = 0
json_data = []
json_errors = []
# while i < 35500 and count < 32246:
while i < 35500 and count < 100:
    html = requests.get(f'https://citywalls.ru/house{i}.html')
    if html.status_code == 404:
        i += 1
        continue
    elif html.status_code != 200:
        json_errors.append({'page': f'/house{i}.html', 'status_code': html.status_code})
        i += 1
        er += 1
        continue
    try:
        data = par_html(html.text)
        data['page'] = f'/house{i}.html'
    except Exception:
        json_errors.append({'page': f'/house{i}.html', 'status_code': 'error', 'error': str(Exception)})
        i += 1
        er += 1
        continue
    json_data.append(data)
    count += 1
    i += 1

with open('data.json', 'w') as f:
    json.dump(json_data, f, indent=4, ensure_ascii=False)

with open('errors.json', 'w') as f:
    json.dump(json_errors, f, indent=4, ensure_ascii=False)

print('last page:', i, 'count:', count, 'errors:', er, end=' ')