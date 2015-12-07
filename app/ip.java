package com.albahra.plugin.networkinterface;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.net.DhcpInfo;

public class networkinterface extends CordovaPlugin {
	public static final String GET_IP_ADDRESS="getIPAddress";
	public static final String GET_GATEWAY="getGateway";
	public static final String GET_NET_MASK="getNetMask";

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		try {
			if (GET_IP_ADDRESS.equals(action)) {
				String ip = getIPAddress();
				String fail = "0.0.0.0";
				if (ip.equals(fail)) {
					callbackContext.error("Got no valid IP address");
					return false;
				}
				callbackContext.success(ip);
				return true;
			}
			if (GET_GATEWAY.equals(action)) {
				String ip = getGateway();
				String fail = "0.0.0.0";
				if (ip.equals(fail)) {
					callbackContext.error("Got no valid gateway");
					return false;
				}
				callbackContext.success(ip);
				return true;
			}
			if (GET_NET_MASK.equals(action)) {
				String ip = getNetMask();
				String fail = "0.0.0.0";
				if (ip.equals(fail)) {
					callbackContext.error("Got no valid subnet mask");
					return false;
				}
				callbackContext.success(ip);
				return true;
			}
			callbackContext.error("Error no such method '" + action + "'");
			return false;
		} catch(Exception e) {
			callbackContext.error("Error while retrieving the IP address. " + e.getMessage());
			return false;
		}
	}

	private String getIPAddress() {
		WifiManager wifiManager = (WifiManager) cordova.getActivity().getSystemService(Context.WIFI_SERVICE);
		WifiInfo wifiInfo = wifiManager.getConnectionInfo();
		int ip = wifiInfo.getIpAddress();

		String ipString = String.format(
			"%d.%d.%d.%d",
			(ip & 0xff),
			(ip >> 8 & 0xff),
			(ip >> 16 & 0xff),
			(ip >> 24 & 0xff)
		);

		return ipString;
	}

	private String getGateway() {
		WifiManager wifiManager = (WifiManager) cordova.getActivity().getSystemService(Context.WIFI_SERVICE);
		DhcpInfo dhcpInfo = wifiManager.getDhcpInfo();

		int gateway = dhcpInfo.gateway;

		String ipString = String.format(
			"%d.%d.%d.%d",
			(gateway & 0xff),
			(gateway >> 8 & 0xff),
			(gateway >> 16 & 0xff),
			(gateway >> 24 & 0xff)
		);

		return ipString;
	}

	private String getNetMask() {
		WifiManager wifiManager = (WifiManager) cordova.getActivity().getSystemService(Context.WIFI_SERVICE);
		DhcpInfo dhcpInfo = wifiManager.getDhcpInfo();

		int mask = dhcpInfo.netmask;

		String ipString = String.format(
			"%d.%d.%d.%d",
			(mask & 0xff),
			(mask >> 8 & 0xff),
			(mask >> 16 & 0xff),
			(mask >> 24 & 0xff)
		);

		return ipString;
	}
}
