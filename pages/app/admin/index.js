import UserService from "@utility/services/user";
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast";
import styled from "styled-components";
import {Loading, Pagination} from "@nextui-org/react";
import { CopySimple } from "phosphor-react";
import { StyledDropdown } from "@elements/dropdown";
import MapViewer from "@elements/Google/mapViewer";
import { PrimaryButton, SecondaryButton } from "@elements/button";
import { SimpleInput } from "@elements/input";
import { useDebounce } from "@hooks/debounce";
import { adminAllOrders } from "@hooks/watchOrder";
import { statusColor, statusMap } from "@utility/constants/common";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  th{
    font-size: 14px;
    padding: 5px;
    font-weight: normal;
  }

  table{
    box-sizing: border-box;

    margin: 20px;
    background: rgb(230,230,230);
    width: calc(100% - 40px );
    padding: 20px;
    border-radius: 5px;
  }

  .footer-table{
    margin:0 20px;
    display: flex;
    justify-content: space-between;
  }

  span{
    font-size: 12px;
  }
`

const LoadingContainer = styled.div`
  position: fixed;
  right: 25px;
  top: 15px;
`

export default function AdminPortal () {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapItem, setMapItem] = useState(null);
  const [apiLaoding, setApiLoading] = useState(false);
  const [search, setSearch] = useState('');
  const {data: allOrders, loading: orderLoading} = adminAllOrders();
  const [vendorEmails, setVendorEmails] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const lowestDate = new Date("2023-05-01")
  const [dateRange, setDateRange] = useState([lowestDate, new Date()])
  
  const fetchData = async () => {
    try {
      setLoading(true)
      const users = await UserService.getAllUsers();
      const userEmails = users.filter(x => x.type !== 'admin');
      setUserEmails(userEmails);
      const vendorEmails = await UserService.getAllVendors();
      setVendorEmails(vendorEmails)
    } catch (error) {
      toast.error("There was error fetching data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  function getRandomDate() {
    const may2023 = new Date('2023-05-01'); // May 2023
    const today = new Date(); // Current date
  
    // Calculate the time difference in milliseconds between May 2023 and today
    const timeDiff = today - may2023;
  
    // Generate a random time value between 0 and the time difference
    const randomTime = Math.random() * timeDiff;
  
    // Create a new date by adding the random time value to May 2023
    const randomDate = new Date(may2023.getTime() + randomTime);
  
    return randomDate;
  }

  const readyData = () => {
    let arr = allOrders.map(order => {
      if(order.createDate && order.createDate.seconds){
        //convert firebae timestamp to date
        const milliseconds = order.createDate.seconds * 1000 + Math.floor(order.createDate.nanoseconds / 1000000);
        const date = new Date(milliseconds);
        order.createDate = date;
      } else if (!order.createDate){
        order.createDate = getRandomDate();
      }

      if(order.userId){
        const user = userEmails.find(x => x.id === order.userId)

        if(!!user){
          order.userProfile = {
            ...user,
            type: 'user'
          };
        }
      }
      if(order.vendorId){
        const vendor = vendorEmails.find(x => x.id === order.vendorId)
        if(!!vendor){
          order.vendorProfile = {
            ...vendor,
            type: 'vendor'
          }
        }
      }
      return order
    })
    userEmails.forEach(user => {
      if(!arr.find(x => x.userId === user.id)){
        arr.push({
          userProfile: {
            ...user,
            type: 'user'
          },
          userId: user.id
        })
      }
    })

    vendorEmails.forEach(vendor => {
      if(!arr.find(x => x.vendorId === vendor.id)){
        arr.push({
          vendorProfile: {
            ...vendor,
            type: 'vendor'
          },
          vendorId: vendor.id
        })
      }
    });
    setData(arr);
  }

  useEffect(() => {
    readyData()
  }, [allOrders, userEmails, vendorEmails])

  const columns = [
    {name: "Order Id", key: "order-id"},
    {name: "Order Status", key: "order-id"},
    {name: "Vendor Name", key: "vendor-name"},
    {name: "Vendor Email", key: "vendor-email"},
    {name: "User Name", key: "user-name"},
    {name: "User Email", key: "user-email"},
    {name: "Created Date", key: "create-date"},
    {name: "Order Rating", key: "order-rating"},
    {name: "Order Price", key: "order-price"},
    {name: "Order Location", key: "order-location"},
    {name: "Order On Map", key: "order-on-map"},
    {name: "Actions", key: "actions"},
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [pageCount, setPageCount] = useState(0);

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
  };

  const finalSearch = useDebounce(search, 500)

  useEffect(() => {
    const itemCount = Number(itemsPerPage);
    let newData = [...data];
    if(finalSearch){
      newData = newData.filter(x => 
        x.userProfile?.email?.toLowerCase?.().includes(finalSearch.toLowerCase?.()) ||
        x.userProfile?.name?.toLowerCase?.().includes(finalSearch.toLowerCase?.()) ||
        x.vendorProfile?.email?.toLowerCase?.().includes(finalSearch.toLowerCase?.()) ||
        x.vendorProfile?.name?.toLowerCase?.().includes(finalSearch.toLowerCase?.()) ||
        x.location?.toLowerCase?.().includes(finalSearch.toLowerCase?.())
      )
    }

    newData = newData.filter(x => x.createDate >= dateRange[0] && x.createDate <= dateRange[1])

    setPageCount(Math.ceil(newData.length / itemsPerPage))

    setFilteredData(newData.slice(
    (currentPage - 1) * itemCount,
    currentPage * itemCount
  ))
  }, [data, currentPage, finalSearch, dateRange])

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const openMap = (item) => {
    setMapOpen(true)
    setMapItem({
      placeName: item.location ,
      latLng: item.latLng
    })
  }

  const updateUser = async (userId, updatedUser) => {
    try {
      setApiLoading(true)
      await UserService.updateUser(updatedUser)
      let orders = [...data];
      orders = orders.map(order => {
        if(order.userId === userId){
          order.userProfile = updatedUser;
        } else if (order.vendorId === userId){
          order.vendorProfile = updatedUser;
        }
        return order;
      });
      setData(orders)
    } catch (error) {
      toast.error("There was error updating")
    } finally {
      setApiLoading(false)
    }
  }

  const toggleBlockUser = (item, block = false) => {
    updateUser(item.userId, {
      ...item.userProfile,
      blocked: block
    })
  }

  const toggleBlockVendor = (item, block = false) => {
    updateUser(item.vendorId, {
      ...item.vendorProfile,
      blocked: block
    })
  }

  const onDateChange = (date, index) => {
    setDateRange(prev => {
      const arr = [...prev];
      arr[index] = date;
      return arr;
    })
  }

  function isValidDate(dateString) {
    const date = new Date(dateString);
    if (
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date) &&
      dateString === date.toISOString().split('T')[0]
    ) {
      return true;
    }
  
    return false;
  }

  const inputDateChange = (date, index) => {
    if(isValidDate(date)){
      onDateChange(new Date(date), index)
    }
  }

  return (<Container>
    {(loading || orderLoading) && 
      <LoadingContainer>
        <Loading size="sm" />
      </LoadingContainer>
    }
    <div className='mx-4 mt-4'>
      <SimpleInput value={search} onChange={e => setSearch(e.target.value)} label="Search" placeholder="Order Id, Vendor/User Name/Email, Location" />
    </div>
    <div className="mx-4 mt-2" >
      <label>Orders between</label>
      <div className="d-flex" >
        <ReactDatePicker
          selected={dateRange[0]} 
          maxDate={dateRange[1]}
          minDate={lowestDate}
          placeholderText="Start Date"
          onSelect={date => onDateChange(date, 0)}
          onChange={date => inputDateChange(date, 0)}
          /> 
        <p className="px-2" >and</p>
        <ReactDatePicker 
          onChange={date => inputDateChange(date, 1)}
          placeholderText="End Date"
          selected={dateRange[1]}
          minDate={dateRange[0]}
          maxDate={new Date()}
          onSelect={date => onDateChange(date, 1)}
        />
      </div>
    </div>
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th align="left" >{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData?.map(item => (
            <RowRenderer 
              openMap={openMap} 
              item={item}
              toggleBlockUser={toggleBlockUser}
              toggleBlockVendor={toggleBlockVendor}
              apiLaoding={apiLaoding}
            />
        ))}
      </tbody>
    </table>
    <div className="footer-table" >
      <Pagination onChange={handlePageChange} page={currentPage} controls total={pageCount} />
      <div className="d-flex align-items-center" > 
          <span className="mr-2" >Page Size</span>
        <StyledDropdown options={[
          {text: '10', value: '10'},
          {text: '50', value: '50'},
          {text: '100', value: '100'},
        ]} setValue={(items) => setItemsPerPage(items)} value={itemsPerPage} />
      </div>
    </div>
    <MapViewer
      open={mapOpen}
      onClose={() => {setMapOpen(false); setMapItem(null)}}
      placeName={mapItem?.placeName}
      latLng={mapItem?.latLng}
    />
  </Container>)
}

function formatDate(toFormat) {
  const date = new Date(toFormat || new Date() )
  const options = { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const IDContainer = styled.div`
  max-width: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
`

const RowContainer = styled.tr`
  font-size: 14px;
  button{
    font-size: 12px;
  }
  td{
    padding: 5px;
  }
`

const OrderStatus = styled.div`
  background: ${({color}) => color};
  color: white;
  padding: 0 10px;
  border-radius: 30px;
  max-width: fit-content;
`

const RowRenderer = ({item, openMap, toggleBlockUser, toggleBlockVendor, apiLaoding}) => {

  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(textToCopy) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(textToCopy);
    }
    return document.execCommand('copy', true, textToCopy);
  }

  const handleCopyClick = (e, textToCopy = '') => {
    e.stopPropagation();
    e.preventDefault();
    copyTextToClipboard(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch(() => {
        ToastMessage.error('Something went wrong while copying.');
      });
  };

  return(<RowContainer>
    <td>
      <div className="d-flex align-items-center" >
        {item.id? 
         <>
          <IDContainer>
          {item.id}
          </IDContainer>
          <CopySimple onClick={e => handleCopyClick(e, item.id)} weight={isCopied? 'fill' : 'regular' } className='cursor-pointer' />
         </>
        :
        '-'
        }
      </div>
    </td>
    <td><OrderStatus color={statusColor[item.status] || 'white'} >{statusMap[item.status] || item.status}</OrderStatus></td>
    <td>{item.vendorProfile? item.vendorProfile.name : 'Not Assigned'}</td>
    <td>
      {item.vendorProfile? 
      <div className="d-flex flex-column" >
        <span>{item.vendorProfile?.email }</span>
        <PrimaryButton loading={apiLaoding} onClick={() => toggleBlockVendor(item, !item.vendorProfile.blocked)} >{item.vendorProfile.blocked? 'Un Block Vendor' : 'Block Vendor'}</PrimaryButton>
      </div>
      : 'Not Assigned'}
    </td>
    <td>{item.userProfile?.name}</td>
    <td>
        {item.userProfile?
          <div className="d-flex flex-column"  >
            <span>{item.userProfile?.email}</span>
            <PrimaryButton loading={apiLaoding} onClick={() => toggleBlockUser(item, !item.userProfile.blocked)}>{item.userProfile.blocked? 'Un Block User' : 'Block User'}</PrimaryButton>
          </div> : 'N/A'
        }
    </td>
    <td>{item.createDate? formatDate(new Date(item.createDate)) : '-'}</td>
    <td>{item.vendorProfile? item.rating || "Not Rated" : '-'}</td>
    <td>{item.bid? `PKR ${item.bid}` : '-'}</td>
    <td>{item.location}</td>
    <td>{item.latLng? <SecondaryButton onClick={() => openMap(item)} >View Map</SecondaryButton> : '-'}</td>
    <td>Actions</td>
  </RowContainer>)
}