//#pragma strict

public class NPC extends Destructable
{
	//STATES
	public var my_state : NPC_state = NPC_state.idle;

	//ADDITIONAL STATE
	private var targetIsNPC : boolean = false;

	//STATISTICS
	public var damage : int = 10;
	private var speed : int = 2;

	//COOLDOWN THRESHOLDS
	protected var searchCooldown : float = 2.0;
	protected var attackCooldown : float = 1.0;
	private var followCooldown : float = 3.0;

	//COOLDOWN TIMER
	protected var timer : float = 0.0;

	//CURRENTLY FOCUSED GAMEOBJECT
	public var target : GameObject = null;

	//SPAWNING TOWER
	protected var homeTower : GameObject = null;

	//CONVERSION
	public var conversionScript : MonoScript;
	
	//SAVED CHILDREN
	private var enemy_detector : Component;

	function Start()
	{
		max_health = 100;
		health = 100;
		enemy_detector = gameObject.GetComponentInChildren(Detect_Enemies);
	}

	function Update () 
	{
		//STATE SPECIFIC BEHAVIORS
		if(my_state == NPC_state.attacking)
		{
			Attack_State();
		}
		else if(my_state == NPC_state.moving)
		{
			Move_State();
		}
		else if(my_state == NPC_state.hunting)
		{
			Hunt_State();
		}
		Idle_State();
		timer += Time.deltaTime;
	}

	//What to always do
	function Idle_State()
	{
		if ((my_state == NPC_state.hunting || my_state == NPC_state.idle) && timer > searchCooldown)
		{
			var newTarget : GameObject;
			newTarget = homeTower.GetComponent(Tower).findSingleEnemy();
			timer = 0.0f;
			if(newTarget != null)
			{
				target = newTarget;
				Change_State(NPC_state.moving);
			}
			else
			{
				Change_State(NPC_state.hunting);
			}
		}
	}
	
	//What to do if the current state is attacking
	function Attack_State()
	{
		if (target == null)
		{
			Change_State(NPC_state.idle);
		}
		else if (Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			if(timer >= attackCooldown)
			{
				timer = 0.0f;
				GetComponent.<Animation>().Stop();
				gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
				GetComponent.<Animation>().Play("BigAttack");
				doDamage();
			}
		}
		else
		{
			Change_State(NPC_state.moving);
		}
	}
	
	//What to do if the current state is moving
	function Move_State()
	{
		if(target != null)
		{
			if(Vector3.Distance(transform.position, target.transform.position) < 1)
			{
				Change_State(NPC_state.attacking);
			}
			else
			{
				if(timer < followCooldown)
				{
					GetComponent.<Animation>().Play("Run");
					gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
					transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
				}
				else
				{
					loseTarget();
				}
			}
		}
		else
		{
			Change_State(NPC_state.idle);
		}
	}
	
	//What to do if the current state is hunting
	function Hunt_State()
	{
		if (target == null)
		{
			target = Functions.Find_Waypoint(gameObject.transform.position);
		}
		else if (Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			target = target.GetComponent("Waypoint").getPrevious();
			if (target == null)
			{
				Change_State(NPC_state.idle);
			}
		}
		else
		{
			GetComponent.<Animation>().Play("Run");
			gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
			transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
		}
	}
	
	//To switch states this function must be gone through
	function Change_State(new_state : NPC_state)
	{
		switch (new_state)
		{
			case NPC_state.idle:
				my_state = NPC_state.idle;
				enemy_detector.SendMessage("Locate_Enemy", true);
				break;
			case NPC_state.moving:
				my_state = NPC_state.moving;
				enemy_detector.SendMessage("Locate_Enemy", false);
				break;
			case NPC_state.attacking:
				my_state = NPC_state.attacking;
				enemy_detector.SendMessage("Locate_Enemy", false);
				break;
			case NPC_state.hunting:
				my_state = NPC_state.hunting;
				enemy_detector.SendMessage("Locate_Enemy", true);
				break;
		}
		timer = 0.0f;
	}

	function setNPC(isNPC : boolean)
	{
		targetIsNPC = isNPC;
	}

	function doDamage()
	{
		var dmgPacket : List.<Object> = new List.<Object>();
		dmgPacket.Add(damage);
		dmgPacket.Add(homeTower);
		target.GetComponent("AI").SendMessage("takeDamage", dmgPacket);
	}

	function linkTower(myTower : GameObject)
	{
		homeTower = myTower;
		for (var child : Transform in gameObject.transform) 
		{
			if(child.name == "Flame")
			{
				child.gameObject.GetComponent("FlameAttack").linkTower(homeTower);
			}
		}
	}

	function Attack (the_target : GameObject)
	{
		target = the_target;
		Change_State(NPC_state.attacking);
	}

	function loseTarget()
	{
		target = null;
		Change_State(NPC_state.idle);
	}

	function takeDamage(dmg_packet : List.<Object>)
	{
		health -= dmg_packet[0];
		if(health <= 0)
		{
			homeTower.GetComponent(Tower).Minion_Died(gameObject);
			Destroy(gameObject);
		}
	}

	function setDamage(amount : int)
	{
		damage = amount;
	}

	function getDamage() : int
	{
		return damage;
	}

	function mend(amount : int) : boolean
	{
		health += max_health / amount;
		if(health >= max_health)
		{
			health = max_health;
			return false;
		}
		return true;
	}

	function getStats() : String
	{
		return "MYNAME" + "\nLevel MYLEVEL: " + "\nHealth: " + health + "/" + max_health + "\nKills MYKILLS: " + "\nTotal Damage: MYDAMAGE" + "\n";
	}
}