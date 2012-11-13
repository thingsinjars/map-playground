/* Javascript
 *
 * See http://jhere.net/docs.html for full documentation
 */
$(window).on('load', function() {
  $('#mapContainer').jHERE({
    enable: ['behavior'],
    center: [40.664167, -73.838611],
    zoom: 8
  });
});