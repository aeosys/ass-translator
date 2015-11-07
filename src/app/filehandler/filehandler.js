angular.module('Replacer.FileHandler', []);

angular.module('Replacer.FileHandler')
    .controller('fileHandlerController', [
        '$scope',
        function ($scope) {
            $scope.files = {
                translationFile: undefined,
                assFile: undefined
            };
            $scope.translation = '';
            $scope.replacedText = '';

            $scope.downloadFileName = '';
            $scope.translationDownload = '';
            $scope.translationReady = false;

            $scope.replace = function replace() {
                var textToReplace = $scope.files.assFile.content;

                // Split to lines. Tolerate both Windows and Unix line breaks
                var lines = $scope.files.translationFile.content.split(/[\r\n]+/g);

                // Replace texts line by line
                for(var i = 0; i < lines.length; i++) {
                    if (lines[i].search(/\|/) < 1) {
                        continue;
                    }

                    // Get original and translated text
                    var translationParts = lines[i].split('|');
                    var original = translationParts[0].trim();

                    // Ellipsis characters are marked with three dots in untranslated ass file
                    original = original.replace('…', '...');
                    var translation = translationParts[1].trim();

                    var originalPosition = textToReplace.indexOf(original);

                    if (originalPosition > -1) {
                        $scope.replacedText += textToReplace.substring(0, originalPosition);
                        textToReplace = textToReplace.substring(originalPosition);

                        // Find text in ass and replace it with translation
                        textToReplace = textToReplace.replace(original, translation);
                    }
                }

                $scope.replacedText += textToReplace;

                $scope.files.assFile.content = $scope.replacedText;
            };

            $scope.downloadFile = function (file) {
                var blob = new Blob([file.content], {
                    type: "data:text/plain;charset=ucs-2;"
                });

                $scope.translationDownload = window.URL.createObjectURL(blob);
                $scope.downloadFileName = file.name;
                $scope.translationReady = true;
            };

            $scope.runReplace = function runReplace() {
                $scope.replace();
                $scope.downloadFile($scope.files.assFile);
            };
        }
    ]);

angular.module('Replacer.FileHandler')
    .directive("fileRead", [function () {
        return {
            scope: {
                fileRead: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();

                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            var file = {
                                name: '',
                                content: ''
                            };

                            file.content = loadEvent.target.result;
                            file.name = changeEvent.target.files[0].name;

                            scope.fileRead = file;
                        });
                    };

                    reader.readAsText(changeEvent.target.files[0]);
                });
            }
        }
    }]);