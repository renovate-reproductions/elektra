class RevisionMiddleware

  class Revision
    def initialize(root = Pathname.new(Dir.pwd))
      @root = root
    end

    def to_s
      @revision ||= begin
        if revision_file.exist?
          revision_file.read.strip
        elsif revision_from_git.present?
          revision_from_git
        else
          "unknown"
        end
      end
    end

    private

    def revision_from_git
      @revision_from_git ||= `git rev-parse HEAD`.strip
    end

    def revision_file
      @root.join("REVISION")
    end
  end

  def initialize(app, options = {})
    @app = app
    @revision = options[:revision] || Revision.new

    if (logger = options[:logger])
      logger.info "[#{self.class.name}] Running: #{@revision}"
    end
  end

  def call(env)
    if env["PATH_INFO"] == "/system/revision"
      body = "#{@revision}\n"
      [200, { "Content-Type" => "text/plain", "Content-Length" => body.size.to_s }, [body]]
    else
      status, headers, body = @app.call(env)
      headers["X-Revision"] = @revision.to_s
      [status, headers, body]
    end
  end
end
