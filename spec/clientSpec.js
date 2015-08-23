describe('TopicsController', function() {
  var $location;

beforeEach(module('text here?'));
beforeEach(inject(function($injector) {

  $location = $injector.get('$location');

  var $controller = $injector.get('$controller');

  createController = function(){
    return $controller('TopicsController', {
      $location: $location,
      $rootScope: $rootScope,
      $scope: $scope
    });
  };

  createController();
}));


afterEach(function() {

})

it('should have a location', function() {
  expect($location).to.be.a('string');
});























// describe('Instances', function() {
//   describe('Collection Instances Exist', function() {

//     it('should have instance "library"', function() {
//       expect(library).to.be.an('object');
//     });

//     it('"library" should be an instance of "LibraryCollection"', function() {
//       expect(library).to.be.instanceOf(LibraryCollection);
//     });

//   });

//   describe('View Instances Exist', function() {

//     it('should have instance "libraryView"', function() {
//       expect(libraryView).to.be.an('object');
//     });

//   });
// });
