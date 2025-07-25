// lib/QuotationPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles to mimic your HTML layout
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    color: '#1E1E1E',
  },
  card: {
    margin: 'auto',
    padding: 20,
    border: '1 solid #1E1E1E',
    borderRadius: 8,
    boxShadow: '6px 5px 0px #262626',
    maxWidth: 600,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1 solid #000',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const QuotationPDF = ({ costItems, total }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.heading}>Cost Summary</Text>

          {costItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{item.label}: {item.value}</Text>
              <Text style={styles.value}>₹{Number(item.price).toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Estimated Cost:</Text>
            <Text style={styles.totalText}>₹{Number(total).toLocaleString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuotationPDF;
