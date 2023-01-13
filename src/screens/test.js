import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];
const address = "http://192.168.1.12:5000"
const Test = () => {
    const [district, setDistrict] = useState([])
    const [ward, setWard] = useState([])
    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const [isFocus1, setIsFocus1] = useState(false);
    const [isFocus2, setIsFocus2] = useState(false);

    const findAll = function(){
        axios.get(`${address}/entity/village`)
          .then(function(res){
            var arr = []
            for(var i = 0; i < res.data.length; i++)
                arr.push({value: res.data[i]._id, label: res.data[i].name, wardList: res.data[i].wards})
            setDistrict(arr)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }

    const handleWard = function(id){
        var arr = []
        for(var i = 0; i < district.length; i++){
            if(district[i].value == id){
                for(var j = 0; j < district[i].wardList.length; j++)
                    arr.push({value: district[i].wardList[j].code, label: district[i].wardList[j].name})
                break
            }
        }
        setWard(arr)
    }

    console.log(value1, value2)

    useEffect(()=>{
        findAll()
    }, [])

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={district}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? 'Select district' : '...'}
                searchPlaceholder="Search..."
                value={value1}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                    setValue1(item.value);
                    setIsFocus1(false);
                    handleWard(item.value)
                }}
            />
            <Dropdown
                style={[styles.dropdown, isFocus2 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={ward}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus2 ? 'Select ward' : '...'}
                searchPlaceholder="Search..."
                value={value2}
                onFocus={() => setIsFocus2(true)}
                onBlur={() => setIsFocus2(false)}
                onChange={item => {
                    setValue2(item.value);
                    setIsFocus2(false);
                }}
            />
        </View>
    );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    justifyContent: "center",
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});