import axios from 'axios'

const BASEURL = 'http://design.uniteonline.cn'
const accessToken = '563efccee2fb1a8492b9146d10f83c31'

const instance = axios.create({
  baseURL: BASEURL,
  timeout: 5000,
  headers: {
  	'X-Requested-With': 'XMLHttpRequest',
  	'Content-Type': 'application/x-www-form-urlencoded'
  }
});


export const baseURL = BASEURL

// designBase
export function getSwiper(){
	return instance({
		url: `api/shop/adv.get_adv_show?ap_id=1083`,
    	method: 'GET',
	})
}
export function boutiqueAtlas(){
	return instance({
		url: `api/shop/case.desinger_recommend_store_case?is_recommend=1`,
    	method: 'GET',
	})
}
export function designAssignment(){
	return instance({
		url: `api/shop/service_common.bid_list?page=4`,
    	method: 'GET',
	})
}
export function excellentDesigner(){
	return instance({
		url: `api/shop/designer_method.get_desinger_recommend_list`,
    	method: 'GET',
	})
}
export function designerExperience(){
	return instance({
		url: `api/shop/designer_method.get_desinger_recommend_list?order=designer_experience desc`,
    	method: 'GET',
	})
}

// designList
export function designList(data){
	data = '' || data
	return instance({
		url: `api/shop/designer_method.get_desinger_recommend_list`+data,
    	method: 'GET',
	})
}
export function has_price() {
	return instance({
		url: `api/shop/designer_method.designer_type?type=price`,
		method: 'GET'
	})
}

// designAbout
export function designAtlas(designer_id){
	return instance({
		url: `api/shop/designer_method.designer_atlas?page=8&designer_id=`+designer_id,
    	method: 'GET',
	})
}
export function designAbout(designer_id){
	return instance({
		url: `api/shop/designer_method.designer_info?designer_id=`+designer_id,
		method: 'GET',
	})
}
export function designEvaluate(designer_id, curpage){
	return instance({
		url: `api/shop/designer_method.getDesignerEvaluate?page=6&designer_id=`+designer_id+`&curpage=`+curpage,
		method: 'GET',
	})
}
export function getDesignerOrder(designer_id, curpage){
	return instance({
		url: `api/shop/designer_method.getDesignerOrder?page=3&designer_id=`+designer_id+`&curpage=`+curpage,
		method: 'GET',
	})
}

// atlasDetails
export function atlasLists(curpage){
	return instance({
		url: `api/shop/designer_method.atlas_list_all?page=12&curpage=`+curpage,
    	method: 'GET',
	})
}

// atlasDetails
export function atlasDetails(atlas_id){
	return instance({
		url: `api/shop/designer_method.atlas_info?atlas_id=`+atlas_id,
    	method: 'GET',
	})
}

// ordersHall
export function ordersHall(page, curpage, data){
	return instance({
		url: `api/shop/service_common.bid_list?page=`+page+`&curpage=`+curpage+data,
    	method: 'GET',
	})
}

// biaoshuDetails
export function biaoshuDetails(bid){
	return instance({
		url: `api/shop/service_common.bid_info?bid_id=`+bid,
    	method: 'GET',
	})
}

//bid
 export function getRei(){
	return instance({
		url: `api/shop/designer_method.designer_type?type=all`,
    	method: 'GET',
	})
}
export function getHouseImg(house_type_id){
	return instance({
		url: `api/shop/designer_method.designer_type?type=house_type_img&house_type_id=`+house_type_id,
		method: 'GET',
	})
}
export function bidding(jsonData) {
	return instance({
		url: `api/shop/service_bid.bid_step1?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}

// biddingList
export function biddingList(bid_type, curpage){
	return instance({
		url: `api/shop/service_bid.my_bid_list?page=6&accessToken=`+accessToken+bid_type+`&curpage=`+curpage,
		method: 'GET'
	})
}
export function retreat(bid){
	return instance({
		url: `api/shop/service_bid.revoke_bid?accessToken=`+accessToken,
		method: 'POST',
		data: bid
	})
}
export function biddingListDetails(bid){
	return instance({
		url: `api/shop/service_bid.my_bid_info?accessToken=`+accessToken+'&bid_id='+bid,
		method: 'GET'
	})
}
export function hasBidding(tenderData){
	return instance({
		url: `api/shop/service_bid.choose_tender?accessToken=`+accessToken,
		method: 'POST',
		data: tenderData
	})
}

// appointment
export function designAppointment(jsonData){
	return instance({
		url: `api/shop/service_member_appointment.appointment?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}
export function serviceApi(){
	return instance({
		url: `api/shop/service_member_appointment.get_supervision_item?accessToken=`+accessToken,
		method: 'GET'
	})
}
export function appointmentList(type){
	return instance({
		url: `api/shop/service_member_appointment.my_appointment_list?page=6&accessToken=`+accessToken+type,
		method: 'GET'
	})
}
export function appointmentDetails(appointment_id){
	return instance({
		url: `api/shop/service_member_appointment.my_appointment_info?appointment_id=`+appointment_id+`&accessToken=`+accessToken,
		method: 'GET'
	})
}
export function appointmentCancel(type, jsonData){
	return instance({
		url: `api/shop/service_member_appointment.`+type+`_appointment?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}
export function appointmentConfirm(jsonData){
	return instance({
		url: `api/shop/service_member_appointment.confirm_quoted_price?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}


// designOrder
export function designOrderList(type, curpage){
	return instance({
		url: `api/shop/service_member_designer_order.order_list?page=6&accessToken=`+accessToken+type+`&curpage=`+curpage,
		method: 'GET'
	})
}

// designOrderDetails
export function designOrderDetails(order_id){
	return instance({
		url: `api/shop/service_member_designer_order.order_info?accessToken=`+accessToken+`&order_id=`+order_id,
		method: 'GET'
	})
}
export function designServiceSubmit(jsonData){
	return instance({
		url: `api/shop/service_member_designer_order.order_confirm?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}

// supervisionOrder
export function supervisionOrder(type, curpage){
	return instance({
		url: `api/shop/service_member_supervisor_order.order_list??page=6&accessToken=`+accessToken+type+`&curpage=`+curpage,
		method: 'GET'
	})
}

// supervisionOrderDetails
export function supervisionOrderDetails(order_id){
	return instance({
		url: `api/shop/service_member_supervisor_order.order_info?accessToken=`+accessToken+`&order_id=`+order_id,
		method: 'GET'
	})
}
export function supervisionServiceSubmit(jsonData){
	return instance({
		url: `api/shop/service_member_supervisor_order.order_confirm?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}

// evaluate
export function evaluate(jsonData){
	return instance({
		url: `api/shop/common.upload_image`,
		method: 'POST',
		data: jsonData
	})
}
export function evaluateSubmit(jsonData){
	return instance({
		url: `api/member/member_evaluate.designer_evaluate?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}

// refundApplication
export function refund_reason(){
	return instance({
		url: `api/shop/service_member_designer_order.refund_reason?accessToken=`+accessToken,
		method: 'GET'
	})
}
export function refundSubmit(jsonData) {
	return instance({
		url: `api/shop/service_member_designer_order.refund_all_post?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}
export function refundDetails(order_id){
	return instance({
		url: `api/shop/service_member_designer_order.order_info?accessToken=`+accessToken+`&order_id=`+order_id,
		method: 'GET',
	})
}

// supervisionrefundApplication
export function supervisionRefund_reason(){
	return instance({
		url: `api/shop/service_member_supervisor_order.refund_reason?accessToken=`+accessToken,
		method: 'GET'
	})
}
export function supervisionRefundSubmit(jsonData) {
	return instance({
		url: `api/shop/service_member_supervisor_order.refund_all_post?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}
export function supervisionRefundDetails(order_id){
	return instance({
		url: `api/shop/service_member_supervisor_order.order_info?accessToken=`+accessToken+`&order_id=`+order_id,
		method: 'GET',
	})
}
export function supervisionOrderEvaluate(jsonData){
	return instance({
		url: `api/member/member_evaluate.supervisor_evaluate?accessToken=`+accessToken,
		method: 'POST',
		data: jsonData
	})
}
