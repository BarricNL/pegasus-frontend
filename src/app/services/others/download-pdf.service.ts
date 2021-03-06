import { Injectable } from '@angular/core';
import * as jsPDF from "jspdf"
import 'jspdf-autotable';
@Injectable({
  providedIn: 'root'
})
export class DownloadPDFService {
  logo = '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'
  constructor() { }

  downloadPDF(learnerName: IInvoiceLearnerName, invoice: IInvoice) {
    let table_header = [['Description', "Quantity", 'Fee']]
    let body = []
    let options = { columnWidth: 'auto' }
    let currentHeight: number = 90
    let interval: number = 10
    let lineSpacing = { NormalSpacing: 12 }
    let startY = 80
    let doc = new jsPDF({
      unit: 'mm',
    })
    // title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0)
    doc.setFillColor(41, 128, 186)
    doc.rect(14, 20, 183, 25, 'F')
    doc.addImage(this.logo, 'PNG', 55, 20);
    // detail
    doc.setFontSize(12);
    doc.text(`Invoice To: ${learnerName.firstName}  ${learnerName.lastName}`, 14, 60);
    doc.text(`From Date ${invoice.BeginDate.slice(0, 10)}`, 140, 60)
    if (invoice.DueDate) {
      doc.text(`Due Date: ${invoice.DueDate.split("T")[0]}`, 140, 70);
    }

    body.push([invoice.CourseName, invoice.LessonQuantity, invoice.LessonFee])

    if (invoice.ConcertFee) {
      currentHeight += interval
      // doc.text(`${invoice.ConcertFeeName}`, 20, currentHeight);
      // doc.text(`$${invoice.ConcertFee}`, 90, currentHeight);
      body.push([invoice.ConcertFeeName, '', invoice.ConcertFee])
    }

    if (invoice.NoteFee) {
      currentHeight += interval
      // doc.text(`${invoice.LessonNoteFeeName}`, 20, currentHeight);
      // doc.text(`$${invoice.NoteFee}`, 90, currentHeight);
      body.push([invoice.LessonNoteFeeName, '', invoice.NoteFee])
    }

    if (invoice.Other1Fee) {
      currentHeight += interval
      // doc.text(`${invoice.Other1FeeName}`, 20, currentHeight)
      // doc.text(`$${invoice.Other1Fee}`, 90, currentHeight)
      body.push([invoice.Other1FeeName, '', invoice.Other1Fee])
    }

    if (invoice.Other2Fee) {
      currentHeight += interval
      // doc.text(`${invoice.Other2FeeName}`, 20, currentHeight)
      // doc.text(`$${invoice.Other2Fee}`, 90, currentHeight)
      body.push([invoice.Other2FeeName, '', invoice.Other2Fee])
    }

    if (invoice.Other3Fee) {
      currentHeight += interval
      // doc.text(`${invoice.Other3FeeName}`, 20, currentHeight)
      // doc.text(`$${invoice.Other3Fee}`, 90, currentHeight)
      body.push([invoice.Other3FeeName, '', invoice.Other3Fee])
    }


    doc.setFontSize(16);
    doc.autoTable({
      head: table_header, body, options,
      startY
    });
    startY = doc.autoTableEndPosY() + 10;
    doc.text(`TOTAL:$ ${invoice.TotalFee}`, 155, startY += lineSpacing.NormalSpacing);




    doc.save(`${learnerName.firstName}  ${learnerName.lastName}'s invoice`);
  }
}

export interface IInvoiceLearnerName {
  firstName: string
  lastName: string
}

export interface IInvoice {
  LessonQuantity?: number
  CourseName: string
  LessonFee: number
  BeginDate?: string
  ConcertFeeName?: string
  ConcertFee?: number
  LessonNoteFeeName?: string
  NoteFee?: number
  Other1FeeName?: string
  Other1Fee?: number
  Other2FeeName?: string
  Other2Fee?: number
  Other3FeeName?: string
  Other3Fee?: number
  TotalFee: number
  DueDate?: string
  [propName: string]: any;
}
