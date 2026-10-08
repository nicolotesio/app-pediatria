from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader
import shutil
import math
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/trauma-cranico-genitori.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
(ROOT / 'public/schede').mkdir(parents=True, exist_ok=True)
# Logos recovered from the original supplied by the user, without alteration.
sip = Image.open(ROOT / 'scripts/assets/sip.png')
simeup = Image.open(ROOT / 'scripts/assets/simeup.png')
c = canvas.Canvas(str(OUT), pagesize=(595.28, 841.89))
c.setTitle('Trauma cranico - Informazioni per i genitori')
c.setAuthor('Contenuti: SIP / SIMEUP; impaginazione: Appunti di Pediatria')
blue = '#17465C'
body = ParagraphStyle('body', fontName='Helvetica', fontSize=11.5, leading=15, textColor=HexColor('#202B32'))
small = ParagraphStyle('small', parent=body, fontSize=7.5, leading=10)
y = 0

def para(text, gap=6, style=body, x=40, width=515):
    global y
    p = Paragraph(text, style)
    _, h = p.wrap(width, 800)
    p.drawOn(c, x, y-h)
    y -= h + gap

def icon(kind, x, top, size=25, color=blue):
    """Small vector illustrations, legible in colour and monochrome printing."""
    c.saveState()
    c.translate(x, top-size)
    c.scale(size/30, size/30)
    c.setStrokeColor(HexColor(color)); c.setFillColor(HexColor(color))
    c.setLineWidth(1.7); c.setLineCap(1); c.setLineJoin(1)
    if kind == 'moon':
        path=c.beginPath(); path.moveTo(22,27)
        path.curveTo(2,30,0,5,18,3); path.curveTo(24,2,29,7,29,13)
        path.curveTo(16,6,10,22,22,27); c.drawPath(path,stroke=1,fill=0)
    elif kind == 'sun':
        c.circle(15,15,6,stroke=1,fill=0)
        for i in range(8):
            a=i*math.pi/4
            c.line(15+10*math.cos(a),15+10*math.sin(a),15+14*math.cos(a),15+14*math.sin(a))
    elif kind == 'hospital':
        c.roundRect(4,2,22,26,2,stroke=1,fill=0)
        c.line(11,21,19,21); c.line(15,17,15,25)
        c.rect(12,2,6,8,stroke=1,fill=0)
        c.line(8,13,9,13); c.line(21,13,22,13)
    elif kind == 'book':
        path=c.beginPath(); path.moveTo(15,3); path.lineTo(2,6); path.lineTo(2,26); path.lineTo(15,23); path.lineTo(28,26); path.lineTo(28,6); path.close()
        c.drawPath(path); c.line(15,3,15,23)
        c.line(6,20,11,19); c.line(19,19,24,20)
    elif kind == 'screen':
        c.roundRect(2,8,26,18,2,stroke=1,fill=0)
        c.line(15,8,15,3); c.line(9,3,21,3)
        c.line(6,22,11,22)
    elif kind == 'ball':
        c.circle(15,15,13,stroke=1,fill=0)
        c.ellipse(9,2,21,28,stroke=1,fill=0)
        c.line(2,15,28,15)
    elif kind == 'clock':
        c.circle(15,15,13,stroke=1,fill=0)
        c.line(15,15,15,24); c.line(15,15,22,11)
    else:
        c.circle(15,15,13,stroke=1,fill=0)
        c.line(15,9,15,17); c.circle(15,22,1,stroke=0,fill=1)
    c.restoreState()

def heading(text):
    global y
    alert = text.startswith('Riportate')
    color = '#903522' if alert else blue
    y -= 5
    c.setFillColor(HexColor('#FFF0EB' if alert else '#EDF4F6'))
    c.roundRect(40,y-32,515,32,4,fill=1,stroke=0)
    icon('hospital' if alert else 'clock',48,y-5,22,color)
    y -= 8
    para(text, 0, ParagraphStyle('heading', parent=body, fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=HexColor(color)), x=79, width=469)
    y -= 17

def illustrated_label(text, kind):
    global y
    icon(kind,43,y+2,22)
    para('<b>'+text+'</b>',6,x=77,width=478)

def activity(title, text, kind):
    global y
    y -= 8
    icon(kind,47,y,35)
    para('<b>'+title+'</b>',5,x=99,width=449)
    para(text,9,x=99,width=449)

def bullets(items):
    for text in items:
        para('• ' + text, 3, x=47, width=501)

def page(title, subtitle, number):
    global y
    c.setFillColor(HexColor(blue))
    c.rect(40, 813, 515, 3, fill=1, stroke=0)
    c.drawImage(ImageReader(sip), 40, 757, width=49, height=40, mask='auto')
    c.drawImage(ImageReader(simeup), 508, 757, width=45, height=40, mask='auto')
    c.setFont('Helvetica', 8)
    c.drawString(111, 781, 'SIP / SIMEUP')
    c.setFont('Helvetica', 8)
    c.drawString(111, 767, 'INFORMAZIONI PER I GENITORI')
    y = 744
    para(title, 7, ParagraphStyle('title', parent=body, fontName='Helvetica-Bold', fontSize=23, leading=27, textColor=HexColor(blue)))
    para(subtitle, 13, ParagraphStyle('sub', parent=body, fontSize=11, leading=14))
    c.setStrokeColor(HexColor('#CCD6DA'))
    c.line(40, 52, 555, 52)
    p = Paragraph('Fonte: PDTA sul trauma cranico pediatrico, Ospedale Infantile Regina Margherita di Torino, 11/04/2017, Allegato 2.<br/>Reimpaginazione: Appunti di Pediatria, 07/10/2026.', small)
    _, footer_height = p.wrap(465, 50); p.drawOn(c,40,46-footer_height)
    c.setFont('Helvetica',8); c.drawRightString(555,31,'1 / 1')

page('Il bambino ha battuto la testa', 'Cosa dovete sapere e controllare a casa', 1)
para('Il vostro bambino è stato visitato per un trauma cranico e adesso può andare a casa.')
para('È importante però che nei prossimi giorni (<b>in particolare nelle prime 24 ore dal trauma</b>) il bambino venga attentamente osservato da un adulto.')
para('Tenete il bambino in un ambiente tranquillo e non mettetevi in viaggio. Applicate del ghiaccio a cicli sulla zona contusa e mantenete una dieta leggera per 1-2 giorni.')
heading('Cosa dovete controllare nelle prime 24 ore?')
illustrated_label('Mentre dorme (ogni 2 o 3 ore)', 'moon')
bullets(['controllate che abbia un respiro regolare e una posizione rilassata', 'controllate che reagisca alla voce o a un delicato pizzicotto'])
para('Se notate delle anomalie svegliate il bambino per capire meglio.')
illustrated_label('Quando è sveglio, osservate come si comporta', 'sun')
bullets(['assicuratevi che si muova normalmente e utilizzi braccia e mani per prendere qualche oggetto a lui caro', 'se è grandicello chiedergli di parlare, di dire i nomi di persone che conosce o di qualche giocattolo'])
heading('Riportate subito il bambino in ospedale se presenta:')
bullets(['<b>difficoltà a mantenere gli occhi aperti e a rimanere sveglio</b>, sonnolenza senza motivo e in ore insolite della giornata', '<b>disturbo nel parlare, nel comprendere</b>, confusione nel ricordare nomi, luoghi, date', '<b>disturbo dell’equilibrio</b> e difficoltà nel camminare', '<b>irritabilità o pianto continuo</b> e lamentoso nei bimbi più piccoli', '<b>mal di testa forte e persistente</b> che risponde poco al paracetamolo', '<b>vomito ripetuto</b> a distanza dal trauma', '<b>disturbi della vista</b>, pupille di grandezza diversa, strabismo o incapacità di fissare con lo sguardo oggetti e/o persone', '<b>convulsioni</b>', '<b>sanguinamento o perdita di liquido</b> da orecchie e/o naso', '<b>comparsa di cefaloematoma</b> (tumefazione molle del capo) o peggioramento del cefaloematoma preesistente.'])
para('<b>Vi raccomandiamo di mettere in pratica tutte le precauzioni per evitare gli infortuni sempre e soprattutto nei giorni successivi al trauma cranico!</b>', 6)
print('Page 1 bottom:', y)
assert y > 60
c.showPage()
page('I sintomi commotivi', 'Cosa sono e come potete aiutare il vostro bambino', 2)
para('In caso di trauma cranico importante il vostro bambino potrebbe presentare dei sintomi commotivi, ovvero segni di affaticamento del cervello come:')
bullets(['mal di testa che passa con il paracetamolo', 'stanchezza eccessiva, irritabilità, cambiamenti di umore', 'nausea o scarso appetito', 'problemi di memoria o difficoltà a concentrarsi', 'disturbi del sonno', 'vertigini'])
para('Questi disturbi di solito scompaiono nel giro di due settimane, ma se li notate parlatene con il vostro Medico curante che valuterà la necessità di una visita specialistica se i sintomi non dovessero migliorare.', 12)
heading('Per favorire la risoluzione dei sintomi commotivi')
activity('Attività che richiedono concentrazione', 'evitate le attività che richiedono concentrazione prolungata (videogiochi e televisione, lettura prolungata, compiti scolastici)', 'screen')
activity('Ritorno a scuola', 'fate riprendere gradualmente l’attività scolastica al vostro bambino in base all’andamento dei sintomi, chiedete agli insegnanti se possibile di concedere al bambino qualche pausa tra le lezioni', 'book')
activity('Ripresa dello sport', 'fate riprendere gradualmente l’attività fisico-sportiva e solo dopo aver controllato che il vostro bambino riesca a sostenere la normale attività scolastica senza disturbi. L’attività fisico-sportiva potrebbe mettere a rischio di ulteriori traumi il vostro bambino, perché richiede coordinazione e riflessi pronti, che dopo un trauma cranico possono non funzionare al meglio', 'ball')
y -= 8
para('<b>Vi raccomandiamo di mettere in pratica tutte le precauzioni per evitare gli infortuni sempre e soprattutto nei giorni successivi al trauma cranico!</b>', 6)
print('Page 2 bottom:',y)
assert y > 60
c.save()
reader = PdfReader(OUT)
for page, name in zip(reader.pages, ['trauma-cranico-monitoraggio', 'trauma-cranico-sintomi-commotivi']):
    writer = PdfWriter()
    writer.add_page(page)
    writer.add_metadata({'/Title': 'Trauma cranico - ' + ('Monitoraggio a casa' if 'monitoraggio' in name else 'Sintomi commotivi'), '/Author': 'Contenuti: SIP / SIMEUP; impaginazione: Appunti di Pediatria'})
    dest = ROOT / 'output/pdf' / (name + '.pdf')
    writer.write(dest)
    shutil.copyfile(dest, ROOT / 'public/schede' / dest.name)
    print(dest)
OUT.unlink()
