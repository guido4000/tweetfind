
Template.main.created = function ( ) {
  if (typeof(Zenbox) !== "undefined") {
    console.log("rendered docupload");
    Zenbox.init({
      dropboxID:   "20171537",
      url:         "https://us24.zendesk.com",
      tabID:       "support",
      tabText:     "Support",
      tabImageURL: "https://assets.zendesk.com/external/zenbox/images/tab_de_support.png",
      tabColor:    "073a7c",
      tabPosition: "Left"
    });
  }
};