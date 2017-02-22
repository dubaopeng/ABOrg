SAPP_ENDPOINT = "https://sapp.amazon.com"

FILE_LIST = [
	{ :path => '/s/bin/sapp', :dir => '/usr/local/bin/', :name => 'sapp'},
	{ :path => '/s/bin/sapp.rb',  :dir => '/usr/local/lib/sapp/', :name => 'sapp.rb'}
]

class String
def red;            "\033[31m#{self}\033[0m" end
def green;          "\033[32m#{self}\033[0m" end
end

def check_dependencies
	puts "Checking dependencies"

	begin
		require "rubygems"
	rescue LoadError
		puts "Cannot load rubygems".red
		puts "Please install rubygems package on your local host"

		exit! 1
	end

	begin
		require "rubygems"

		print "Checking gem: json "
		require "json"
		print "OK\n".green

	rescue LoadError
		puts "NOT OK".red
		puts "Please install missing gems by running:\n    gem install <gem name>"

		exit! 1
	end
end

def install

	"Installing..."

	FILE_LIST.each{ |whitelist|
		localFilename = "#{whitelist[:dir]}/#{whitelist[:name]}"
		content = `curl -k -s --anyauth --location-trusted -u: -c /tmp/sapp_cookies.txt -b /tmp/sapp_cookies.txt --request GET #{SAPP_ENDPOINT}/#{whitelist[:path]}`

		if not File.exist?(whitelist[:dir])
			Dir.mkdir(whitelist[:dir])
		end

		File.open(localFilename, "wb") { |file| 
			file.write(content)
		}
		File.chmod(0755, localFilename)

	}
	puts "Done."
end

check_dependencies
install