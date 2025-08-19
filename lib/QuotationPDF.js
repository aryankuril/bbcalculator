// lib/QuotationPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1E1E1E',
  },
  card: {
    padding: 24,
    border: '1 solid #1E1E1E',
    borderRadius: 8,
    maxWidth: 500,
    alignSelf: 'flex-start', // Ensure it aligns to the top
  },

  heading: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'left',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftText: {
    fontWeight: 600,
    width: '70%',
  },
  rightText: {
    width: '30%',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 12,
    borderTop: '1 solid #000',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'right',
  },
});

const QuotationPDF = ({ costItems, total }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.heading}>Cost Summary </Text>

          {costItems.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.leftText}>
                {item.type}: <Text style={{ fontWeight: 400 }}>{item.value}</Text>
              </Text>
              <Text style={styles.rightText}>{Number(item.price).toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Cost:</Text>
            <Text style={styles.totalValue}>{Number(total).toLocaleString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuotationPDF;
